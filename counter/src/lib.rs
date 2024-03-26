use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    // program_error::ProgramError,
    pubkey::Pubkey,
};

use crate::instructions::CounterInstructions;
pub mod instructions;

// programs on solana are often stateless, so we need a state account
#[derive(Debug, BorshSerialize, BorshDeserialize)]
pub struct CounterAccount {
    pub counter: u32,
}

entrypoint!(process_instruction);

// this is standard solana program entry point name
pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("Counter program entry point");

    // unpack the instruction
    let instruction = CounterInstructions::unpack(instruction_data)?;

    msg!("Created instruction");
    // unpack the accounts
    let account_iter = &mut accounts.iter();
    let account = next_account_info(account_iter)?;

    msg!("Created accounts");

    // convert the account data to our state struct. If the conversion is successful,
    // it assigns to counter_account variable.
    // The borrow() method is used to create a temporary reference to the data.
    let mut counter_account = CounterAccount::try_from_slice(&account.data.borrow())?;
    msg!("Created counter_account");

    // match the instruction
    match instruction {
        CounterInstructions::Increment(args) => {
            counter_account.counter = counter_account.counter.saturating_add(args.value);
            msg!(
                "Counter incremented by {}; new value is {}.",
                args.value,
                counter_account.counter
            );
        }

        CounterInstructions::Decrement(args) => {
            match counter_account.counter.checked_sub(args.value) {
                Some(new_value) => {
                    counter_account.counter = new_value;
                    msg!(
                        "Counter decremented by {}; new value is {}.",
                        args.value,
                        new_value
                    );
                }
                None => {
                    counter_account.counter = 0;
                    msg!(
                      "Decrementing by {} would result in a negative counter value. Counter set to 0.",
                      args.value
                  );
                }
            }
        }

        CounterInstructions::Update(args) => {
            counter_account.counter = args.value;
            msg!(
                "Counter updated by {}. New value is {}.",
                args.value,
                counter_account.counter
            );
        }

        CounterInstructions::Reset => {
            counter_account.counter = 0;
            msg!("Counter reset to 0.");
        }
    }

    counter_account.serialize(&mut &mut account.data.borrow_mut()[..])?;
    msg!("Serialized account");

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use solana_program::{clock::Epoch, pubkey::Pubkey};
    use std::mem;

    #[test]
    fn test_counter() {
        let program_id = Pubkey::default(); // create a mock account for testing
        let key = Pubkey::default();
        let mut lamports = 0;
        let mut data = vec![0; mem::size_of::<u32>()];
        let owner = Pubkey::default();
        // create an account
        let account = AccountInfo::new(
            &key,
            false,
            true,
            &mut lamports,
            &mut data,
            &owner,
            false,
            Epoch::default(),
        );

        // turn account into a vector of accounts
        let accounts = vec![account];

        // instruction data
        let mut increment_instruction_data = vec![0];
        let mut decrement_instruction_data = vec![1];
        let mut update_insturction_data = vec![2];
        let reset_instruction_data = vec![3];

        let increment_value = 20u32;
        increment_instruction_data.extend_from_slice(&increment_value.to_le_bytes());
        process_instruction(&program_id, &accounts, &increment_instruction_data).unwrap();
        assert_eq!(
            CounterAccount::try_from_slice(&accounts[0].data.borrow())
                .unwrap()
                .counter,
            20
        );

        // happy path
        let decrement_value = 5u32;
        decrement_instruction_data.extend_from_slice(&decrement_value.to_le_bytes());

        process_instruction(&program_id, &accounts, &decrement_instruction_data).unwrap();
        assert_eq!(
            CounterAccount::try_from_slice(&accounts[0].data.borrow())
                .unwrap()
                .counter,
            15
        );

        // error path
        let decrement_value = 30u32;
        decrement_instruction_data.extend_from_slice(&decrement_value.to_le_bytes());
        process_instruction(&program_id, &accounts, &decrement_instruction_data).unwrap();

        assert_eq!(
            CounterAccount::try_from_slice(&accounts[0].data.borrow())
                .unwrap()
                .counter,
            0
        );

        let update_value = 1u32;
        update_insturction_data.extend_from_slice(&update_value.to_le_bytes());
        process_instruction(&program_id, &accounts, &update_insturction_data).unwrap();
        assert_eq!(
            CounterAccount::try_from_slice(&accounts[0].data.borrow())
                .unwrap()
                .counter,
            1
        );

        process_instruction(&program_id, &accounts, &reset_instruction_data).unwrap();
        assert_eq!(
            CounterAccount::try_from_slice(&accounts[0].data.borrow())
                .unwrap()
                .counter,
            0
        );
    }
}
