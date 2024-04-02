use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_error::ProgramError;
use solana_program::program_pack::{IsInitialized, Sealed};
use thiserror::Error;

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct AccountState {
    pub is_initialized: bool,
    pub rating: u8,
    pub description: String,
    pub title: String,
    pub location: String,
}

impl Sealed for AccountState {}

impl IsInitialized for AccountState {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

#[derive(Error, Debug)]
pub enum ReviewError {
    #[error("Account not IsInitialized")]
    UninitalizedAccount,

    #[error("Rating greater than 10 or less than 1")]
    InvalidRating,

    #[error("PDA error")]
    InvalidPDA,
}

impl From<ReviewError> for ProgramError {
    fn from(e: ReviewError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
