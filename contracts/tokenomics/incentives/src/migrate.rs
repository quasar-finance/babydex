#![cfg(not(tarpaulin_include))]

#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{DepsMut, Empty, Env, Response};
use cw2::{get_contract_version, set_contract_version};

use crate::error::ContractError;
use crate::instantiate::{CONTRACT_NAME, CONTRACT_VERSION};

/// Manages the contract migration.
#[cfg(not(tarpaulin_include))]
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(deps: DepsMut, _env: Env, _msg: Empty) -> Result<Response, ContractError> {
    let version = get_contract_version(deps.storage)?;

    match version.contract.as_ref() {
        CONTRACT_NAME => match version.version.as_ref() {
            "1.3.0" => {}
            _ => return Err(ContractError::MigrationError {}),
        },
        _ => return Err(ContractError::MigrationError {}),
    }

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    Ok(Response::new()
        .add_attribute("previous_contract_name", &version.contract)
        .add_attribute("previous_contract_version", &version.version)
        .add_attribute("new_contract_name", CONTRACT_NAME)
        .add_attribute("new_contract_version", CONTRACT_VERSION))
}
