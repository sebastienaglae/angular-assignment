const AccountDto = account => {
    // Only include non-sensitive fields
    return {
        id: account._id,
        username: account.username,
        role: account.role
    };
}

module.exports = { AccountDto };