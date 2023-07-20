use anchor_lang::prelude::*;

declare_id!("EKbFPopd5FLJqDFKPAHtRcaZTDT53yiGQPu3mZJyvkb");

//J3iNvcY1T9ZedMEdt8SY7fZRRgH2WxG1qdy1q5kqNaUy

#[program]
mod user_input {
    use super::*;
    pub fn initialize(ctx: Context<InsertData>, data: String) -> Result<()> {
        ctx.accounts.new_account.data = data.to_string();
        msg!("Your entry was {}", data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InsertData<'info> {

    #[account(init, payer = signer, space = 8 + 32)]
    pub new_account: Account<'info,  UserInput>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct UserInput {
    data: String,
}