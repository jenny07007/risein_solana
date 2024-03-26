use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_error::ProgramError;

#[derive(Debug, BorshSerialize, BorshDeserialize)]

pub struct UserInputValue {
    pub value: u32,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct UpdateArgs {
    pub value: u32,
}

pub enum CounterInstructions {
    Increment(UserInputValue),
    Decrement(UserInputValue),
    Update(UpdateArgs),
    Reset,
}

// unpacking the instructions
impl CounterInstructions {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variants, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;

        Ok(match variants {
            0 => Self::Increment(UserInputValue::try_from_slice(rest)?),
            1 => Self::Decrement(UserInputValue::try_from_slice(rest)?),
            2 => Self::Update(UpdateArgs::try_from_slice(rest)?),
            3 => Self::Reset,
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
}
