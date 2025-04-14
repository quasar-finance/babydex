use axum::{
    extract::State,
    response::{Html, IntoResponse},
    routing::get,
    Router,
};
use serde::{Deserialize, Serialize};
use std::env;
use std::sync::Arc;
use reqwest::header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE};
use tera::Tera;
use tower_http::services::ServeDir;
use shuttle_runtime::SecretStore;

#[derive(Debug, Deserialize, Clone, Serialize)]
struct PoolMetric {
    pool_address: String,
    height: i64,
    token0_denom: String,
    token0_balance: i64,
    token0_decimals: i32,
    token0_price: f64,
    token0_swap_volume: f64,
    token1_denom: String,
    token1_balance: i64,
    token1_decimals: i32,
    token1_price: f64,
    token1_swap_volume: f64,
    tvl_usd: f64,
    average_apr: f64,
    lp_token_address: String,
    total_incentives: i64,
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
    let client = reqwest::Client::new();
    let api_url = state.api_url.clone();
    let auth = state.auth.clone();
    let response = client
        .post(&format!("{}", api_url))
        .header(AUTHORIZATION, format!("Basic: Bearer {}", auth)) //"Basic ".to_owned() + &*auth)
        .header(CONTENT_TYPE, "application/json")
        .header(ACCEPT, "application/json")
        .send()
        .await;

    match response {
        Ok(res) => {
            if res.status().is_success() {
                match res.json::<Vec<PoolMetric>>().await {
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
                    Err(e) => Html(format!("Error parsing API response: {}", e)).into_response(),
                }
            } else {
                Html(format!("Error fetching data from API: {} {:?}", res.status(), res.error_for_status_ref())).into_response()
            }
        }
        Err(e) => Html(format!("Error connecting to API: {}", e)).into_response(),
    }
}

async fn hello_world() -> &'static str {
    "Hello, world!"
}

#[shuttle_runtime::main]
async fn main(#[shuttle_runtime::Secrets] secrets: SecretStore) -> shuttle_axum::ShuttleAxum {
    // let router = Router::new().route("/", get(hello_world));

    let tera = Arc::new(Tera::new(concat!(env!("CARGO_MANIFEST_DIR"), "/templates/**/*")).unwrap());
    let api_url = secrets.get("API_URL").expect("API_URL must be set (e.g., http://localhost:8000)");
    let auth =
        secrets.get("AUTHORIZATION").expect("AUTHORIZATION must be set (e.g., http://localhost:8000)");
    let state = Arc::new(AppState {
        tera,
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
