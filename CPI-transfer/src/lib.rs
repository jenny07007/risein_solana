use {
    solana_program::{
        account_info::{next_account_info, AccountInfo},
        entrypoint::ProgramResult,
        msg,
        program::invoke_signed,
        program_error::ProgramError,
        program_pack::Pack,
        pubkey::Pubkey,
    },
    spl_token::{
        instruction::transfer_checked,
        state::{Account, Mint},
    },
};

solana_program::entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Create an iteror to safely reference accounts in the slice
    let account_info_iter = &mut accounts.iter();

    /* Create these accounts in the order below */
    // represents whose money we are transferring to
    let source_info = next_account_info(account_info_iter)?;
    // contains some information about the token we're transferring
    let mint_info = next_account_info(account_info_iter)?;
    let destination_info = next_account_info(account_info_iter)?;
    // contain info about if we have the authority to transfer
    let authority_info = next_account_info(account_info_iter)?;
    // the token program. which token we are transferring
    let token_program_info = next_account_info(account_info_iter)?;

    // In order to trnsfer from the source account, owned by the program-drived address (PDA)
    // We must have the correct address and seeds.
    let (expected_authority, bump_seed) = Pubkey::find_program_address(&[b"authority"], program_id);
    if expected_authority != *authority_info.key {
        return Err(ProgramError::InvalidArgument);
    }

    // The program transfers everything out of its account, so exrtract that from the account data
    let source_account = Account::unpack_from_slice(&source_info.data.borrow())?;

    // Decode the transfer amount
    if instruction_data.len() < 8 {
        return Err(ProgramError::InvalidInstructionData);
    }
    let amount = u64::from_le_bytes(instruction_data[0..8].try_into().unwrap());

    // Check if the source account has enough balance to transfer
    if source_account.amount < amount {
        return Err(ProgramError::InsufficientFunds);
    }

    // The program uses `transfer_checked` which requires the number of decimals in the mint
    // so extract that from the account data info
    let mint = Mint::unpack_from_slice(&mint_info.data.borrow())?;
    let decimals = mint.decimals;

    // invoke transfer from spl_token
    msg!("Attempting to transfer {} tokens", amount);
    invoke_signed(
        &transfer_checked(
            token_program_info.key,
            source_info.key,
            mint_info.key,
            destination_info.key,
            authority_info.key,
            &[], // no mutisig allowed
            amount,
            decimals,
        )
        .unwrap(),
        &[
            source_info.clone(),
            mint_info.clone(),
            destination_info.clone(),
            authority_info.clone(),
            token_program_info.clone(), // not required, but better for clarity
        ],
        &[&[b"authority", &[bump_seed]]],
    )
}
