use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, AccountId, Promise};
use near_sdk::collections::LookupMap;

near_sdk::setup_alloc!();

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct CashTransfer {
    transaction: LookupMap<String, Vec<String>>
}

impl Default for CashTransfer {
    fn default() -> Self {
        env::panic(b"TransferCash contract should be intitialized before usage")
    }
}

#[near_bindgen]
impl CashTransfer {
    pub fn get_transaction(self, user: String) -> Vec<String> {
        match self.transaction.get(&user){
            Some(x)=>x,
            None=>vec![]
        }
    }

    pub fn add_transaction(&mut self, msg: String, amount: String) {
        let account_id = env::signer_account_id();
       
        if self.transaction.contains_key(&account_id) {
            let mut messages_of_account = match self.transaction.get(&account_id) {
                Some(x) => x,
                None =>vec![]
            };

            messages_of_account.push(msg+" || "+ &amount + " NEAR");
            self.transaction.insert(&account_id, &messages_of_account);
        } else {
            let new_msg = vec![msg+" || "+ &amount + " NEAR"];
            self.transaction.insert(&account_id, &new_msg);
        }
    }

    pub fn transfer_cash(&mut self, account_id: AccountId, amount:f64) {
        Promise::new(account_id).transfer(amount as u128);
    }
}