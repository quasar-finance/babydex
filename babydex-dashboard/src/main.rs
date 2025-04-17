use axum::{
    extract::State,
    response::{Html, IntoResponse},
    routing::get,
    Router,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use shuttle_runtime::SecretStore;
use std::collections::HashMap;
use std::env;
use std::sync::Arc;
use supabase_function_rs::{
    FunctionInvokeOptions, FunctionRegion, FunctionsClient, FunctionsResponse, HttpMethod,
    InvokeBody, ResponseData,
};
use tera::Tera;
use tower_http::services::ServeDir;

#[derive(Debug, Deserialize, Clone, Serialize)]
struct PoolMetric {
    pool_address: Option<String>,
    height: Option<String>, // i64,
    token0_denom: Option<String>,
    token0_balance: Option<String>, // i64,
    token0_decimals: i32,
    token0_price: Option<String>,       // f64,
    token0_swap_volume: Option<String>, // f64,
    token1_denom: Option<String>,
    token1_balance: Option<String>, // i64,
    token1_decimals: i32,
    token1_price: Option<String>,       // f64,
    token1_swap_volume: Option<String>, // f64,
    tvl_usd: Option<f64>,
    average_apr: Option<f64>,
    lp_token_address: Option<String>,
    total_incentives: Option<i64>,
    metric_start_height: Option<i64>,
    metric_end_height: Option<i64>,
}

#[derive(Clone)]
struct AppState {
    tera: Arc<Tera>,
    api_url: String,
    auth: String,
}

async fn index(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let api_url = state.api_url.clone();
    let auth = state.auth.clone();
    let url = api_url.clone();
    let mut headers = HashMap::new();
    headers.insert("Custom-Header".to_string(), "Header-Value".to_string());

    let mut client = FunctionsClient::new(
        url.to_string(),
        Some(headers),
        Some(FunctionRegion::EuCentral1), // Frankfurt, region of supabase
    );
    client.set_auth(format!("{}", auth));

    let mut invoke_options = FunctionInvokeOptions::default();
    invoke_options.method = Some(HttpMethod::Post);
    let mut json_body = HashMap::new();
    json_body.insert(
        "addresses".to_string(),
        json!([
            "bbn1xut80d09q0tgtch8p0z4k5f88d3uvt8cvtzm5h3tu3tsy4jk9xlsfjc5m7",
            "bbn1rwx6w02alc4kaz7xpyg3rlxpjl4g63x5jq292mkxgg65zqpn5llqmyfzfq",
            "bbn1r4x3lvn20vpls2ammp4ch5z08nge6h77p43ktl04efptgqxgl0qsxnwehd",
            "bbn1yum4v0v5l92jkxn8xpn9mjg7wuldk784ctg424ue8gqvdp88qzlqjpr05x",
            "bbn1qjn06jt7zjhdqxgud07nylkpgnaurq6x6vad38vztwxec4rr5ntsnn4dd3",
            "bbn1n9jy4xlk00p2w2rdeumxznzsxrphx8lh95v39g0wkslchpmaqcvsyyxqu4",
            "bbn1kghjaevh56r347v2luwngsdd2qg5hqyhzm20wgp6hllz3eteuv7q27q26f",
            "bbn17a6uvlrd7xyw3t4j2nrgy4kz0v3w8pwasweleqffvptxk6wjs6pqxvpzxw",
            "bbn1etp6acwkfv8kkuurskdepw8aqdwau5gnhjn88nfv5j6zgajdt7lq2dxukh",
            "bbn1qew58vlyt7sx0pf73qq56qrl749456c9ft6tyv2w7q6camhkc7cs8stvlk",
            "bbn1g6yxz0avc7c6mzc6k64lm4t9fh668s0yp5fpm9u32wu4leg4yuhs0e54h2",
            "bbn16slnlmtu7w5hjfwyzucwm75c3kuz40jztckp2766zttdu962tndqy2zks5",
            "bbn1cduudfszcm9slm8qxlaqvnpzg2u0hkus94fe3pwt9x446dtw6eeqwvlnpk",
            "bbn1hs95lgvuy0p6jn4v7js5x8plfdqw867lsuh5xv6d2ua20jprkgeslpzjvl",
        ]),
    );
    invoke_options.body = Some(InvokeBody::Json(json_body));

    match client
        .invoke("get-pool-metrics", Some(invoke_options))
        .await
    {
        Ok(response) => match response {
            FunctionsResponse::Success { data } => match data {
                ResponseData::Json(json) => match serde_json::from_value::<Vec<PoolMetric>>(json) {
                    Ok(pool_metrics) => {
                        let mut context = tera::Context::new();

                        context.insert("pool_metrics", &pool_metrics);

                        match state.tera.render("index.html.tera", &context) {
                            Ok(html) => Html(html).into_response(),
                            Err(e) => {
                                Html(format!("Error rendering template: {}", e)).into_response()
                            }
                        }
                    }
                    Err(e) => {
                        Html(format!("Error parsing JSON response data: {}", e)).into_response()
                    }
                },
                _ => Html(format!("Expected JSON response data: {:?}", data)).into_response(),
            },
            FunctionsResponse::Failure { error } => {
                Html(format!("Error rendering template: {}", error)).into_response()
            }
        },
        Err(e) => Html(format!("Error rendering template: {}", e)).into_response(),
    }
}

#[shuttle_runtime::main]
async fn main(#[shuttle_runtime::Secrets] secrets: SecretStore) -> shuttle_axum::ShuttleAxum {
    let api_url = secrets
        .get("API_URL")
        .expect("API_URL must be set (e.g., <PROJECT_ID>.supabase.co/functions/v1/");
    let auth = secrets
        .get("JWT_TOKEN")
        .expect("JWT_TOKEN must be set (e.g., <YOUR_JWT_TOKEN>");
    let state = Arc::new(AppState {
        tera: {
            let mut tera = Tera::default();
            let template_content = include_bytes!("../templates/index.html.tera");
            tera.add_raw_template("index.html.tera", String::from_utf8_lossy(template_content).as_ref())
                .unwrap();
            Arc::new(tera)
        },
        api_url,
        auth,
    });

    let router = Router::new()
        .route("/", get(index).with_state(state.clone()))
        .nest_service(
            "/static",
            ServeDir::new(concat!(env!("CARGO_MANIFEST_DIR"), "/static")),
        )
        .with_state(state);

    Ok(router.into())
}
