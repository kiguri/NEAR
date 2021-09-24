use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen};
// use near_sdk::collections::LookupMap;

near_sdk::setup_alloc!();

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Counter {
    value: u32
}

impl Default for Counter {
    fn default() -> Self {
        Self {
            value: 0
        }
    }
}

#[near_bindgen]
impl Counter {
    pub fn get_val(&self) -> u32 {
        self.value
    }

    pub fn increment(&mut self) {
        self.value += 1;
        let log_message = format!("Increased number to {}", self.value);
        env::log(log_message.as_bytes());
    }

    pub fn decrement(&mut self) {
        self.value -= 1;
        let log_message = format!("Decreased number to {}", self.value);
        env::log(log_message.as_bytes())
    }

    pub fn reset(&mut self) {
        self.value = 0;
        env::log(b"Reset counter to zero");
    }
}


#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // mock the context for testing, notice "signer_account_id" that was accessed above from env::
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice_near".to_string(),
            signer_account_id: "bob_near".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "carol_near".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    #[test]
    fn increment() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Counter::default();
        contract.increment();
        assert_eq!(1, contract.get_val());
    }


    #[test]
    fn decrement() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Counter {value: 1};
        contract.decrement();
        assert_eq!(0, contract.get_val());
    }

    #[test]
    fn increment_and_reset() {
        let context = get_context(vec![], false);
        testing_env!(context);

        let mut contract = Counter { value: 10};
        contract.increment();
        contract.reset();
        assert_eq!(0, contract.get_val());
    }
}

