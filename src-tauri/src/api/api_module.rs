use reqwest::header::{HeaderMap, HeaderName, HeaderValue};
use reqwest::{self, Client, Error as ReqwestError};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct MyError {
    message: String,
}

impl From<ReqwestError> for MyError {
    fn from(err: ReqwestError) -> MyError {
        MyError { message: err.to_string() }
    }
}

impl From<reqwest::header::InvalidHeaderName> for MyError {
    fn from(err: reqwest::header::InvalidHeaderName) -> MyError {
        MyError { message: err.to_string() }
    }
}

impl From<reqwest::header::InvalidHeaderValue> for MyError {
    fn from(err: reqwest::header::InvalidHeaderValue) -> MyError {
        MyError { message: err.to_string() }
    }
}

#[tauri::command]
pub async fn get_request(
    url: String,
    headers: Option<HashMap<String, String>>,
) -> Result<String, MyError> {
    let client = Client::new();
    let mut request = client.get(&url);

    if let Some(hdrs) = headers {
        let mut header_map = HeaderMap::new();
        for (key, value) in hdrs {
            header_map.insert(
                HeaderName::from_bytes(key.as_bytes())?,
                HeaderValue::from_str(&value)?,
            );
        }
        // Print each header
        for (key, value) in header_map.iter() {
            println!("{:?}: {:?}", key, value);
        }
        request = request.headers(header_map);
    }

    let response = request.send().await?.text().await?;
    Ok(response)
}
