/**
 * Use the `steem_keychain` methods listed below to issue requests to the Steem blockchain.
 */
export const steem_keychain = `
window.steem_keychain={
  current_id: 1,
  requests: {},
  handshake_callback: null,
  /**
   * This function is called to verify Keychain installation on a user's device
   * @param {function} callback Confirms Keychain installation
   */
  requestHandshake: function (callback) {
    this.handshake_callback = callback;
    this.dispatchCustomEvent('swHandshake_steem', '');
  },

  /**
   * This function is called to verify that the user has a certain authority over an account, by requesting to decode a message
   * @param {String} username Steem account to perform the request
   * @param {String} receiver Account that will decode the string
   * @param {String} message Message to be encrypted
   * @param {String} key Type of key. Can be 'Posting','Active' or 'Memo'
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestEncodeMessage: function (
    username,
    receiver,
    message,
    key,
    callback,
    rpc,
  ) {
    var request = {
      type: 'encode',
      username,
      receiver,
      message,
      method: key,
      rpc,
    };

    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * This function is called to verify that the user has a certain authority over an account, by requesting to decode a message
   * @param {String} account Steem account to perform the request
   * @param {String} message Message to be decoded by the account
   * @param {String} key Type of key. Can be 'Posting','Active' or 'Memo'
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestVerifyKey: function (account, message, key, callback, rpc) {
    var request = {
      type: 'decode',
      username: account,
      message: message,
      method: key,
      rpc,
    };

    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Requests a message to be signed with proper authority
   * @param {String} [account=null] Steem account to perform the request. If null, user can choose the account from a dropdown
   * @param {String} message Message to be signed by the account
   * @param {String} key Type of key. Can be 'Posting','Active' or 'Memo'
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   * @param {String} [title=null] Override "Sign message" title
   */
  requestSignBuffer: function (account, message, key, callback, rpc, title) {
    var request = {
      type: 'signBuffer',
      username: account,
      message: message,
      method: key,
      rpc,
      title,
    };

    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Requests to add account authority over another account. For more information about multisig, please read https://peakd.com/utopian-io/@stoodkev/how-to-set-up-and-use-multisignature-accounts-on-steem-blockchain
   * @param {String} account Steem account to perform the request
   * @param {String} authorizedUsername Authorized account
   * @param {String} role Type of authority. Can be 'Posting','Active' or 'Memo'
   * @param {number} weight Weight of the authority
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestAddAccountAuthority: function (
    account,
    authorizedUsername,
    role,
    weight,
    callback,
    rpc,
  ) {
    var request = {
      type: 'addAccountAuthority',
      username: account,
      authorizedUsername,
      role,
      weight,
      method: 'Active',
      rpc,
    };

    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Requests to remove an account authority over another account. For more information about multisig, please read https://peakd.com/utopian-io/@stoodkev/how-to-set-up-and-use-multisignature-accounts-on-steem-blockchain
   * @param {String} account Steem account to perform the request
   * @param {String} authorizedUsername Account to lose authority
   * @param {String} role Type of authority. Can be 'Posting','Active' or 'Memo'
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestRemoveAccountAuthority: function (
    account,
    authorizedUsername,
    role,
    callback,
    rpc,
  ) {
    var request = {
      type: 'removeAccountAuthority',
      username: account,
      authorizedUsername,
      role,
      method: 'Active',
      rpc,
    };

    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Requests to add a new key authority to an account. For more information about multisig, please read https://peakd.com/utopian-io/@stoodkev/how-to-set-up-and-use-multisignature-accounts-on-steem-blockchain
   * @param {String} account Steem account to perform the request
   * @param {String} authorizedKey New public key to be associated with the account
   * @param {String} role Type of authority. Can be 'Posting','Active' or 'Memo'
   * @param {number} weight Weight of the key authority
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestAddKeyAuthority: function (
    account,
    authorizedKey,
    role,
    weight,
    callback,
    rpc,
  ) {
    var request = {
      type: 'addKeyAuthority',
      username: account,
      authorizedKey,
      weight,
      role,
      method: 'Active',
      rpc,
    };

    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Requests to remove a key to an account. For more information about multisig, please read https://peakd.com/utopian-io/@stoodkev/how-to-set-up-and-use-multisignature-accounts-on-steem-blockchain
   * @param {String} account Steem account to perform the request
   * @param {String} authorizedKey Key to be removed (public key).
   * @param {String} role Type of authority. Can be 'Posting','Active' or 'Memo'.
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestRemoveKeyAuthority: function (
    account,
    authorizedKey,
    role,
    callback,
    rpc,
  ) {
    var request = {
      type: 'removeKeyAuthority',
      username: account,
      authorizedKey,
      role,
      method: 'Active',
      rpc,
    };

    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Generic broadcast request
   * @param {String} account Steem account to perform the request
   * @param {Array} operations Array of operations to be broadcasted
   * @param {String} key Type of key. Can be 'Posting','Active' or 'Memo'
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestBroadcast: function (account, operations, key, callback, rpc) {
    var request = {
      type: 'broadcast',
      username: account,
      operations,
      method: key,
      rpc,
    };

    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Requests to sign a transaction with a given authority
   * @param {String} account Steem account to perform the request
   * @param {Object} tx Unsigned transaction
   * @param {String} key Type of key. Can be 'Posting','Active' or 'Memo'
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestSignTx: function (account, tx, key, callback, rpc) {
    var request = {
      type: 'signTx',
      username: account,
      tx,
      method: key,
      rpc,
    };

    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Requests a signed call
   * @param {String} account Steem account to perform the request
   * @param {String} method Method of the call
   * @param {String} params Parameters of the call
   * @param {String} key Type of key. Can be 'Posting','Active' or 'Memo'
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestSignedCall: function (account, method, params, key, callback, rpc) {
    console.log('getting request');
    var request = {
      type: 'signedCall',
      username: account,
      method,
      params,
      typeWif: key,
      rpc,
    };
    console.log(request);
    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },

  // Example comment_options: {"author":"stoodkev","permlink":"hi","max_accepted_payout":"100000.000 SBD","percent_steem_dollars":10000,"allow_votes":true,"allow_curation_rewards":true,"extensions":[[0,{"beneficiaries":[{"account":"yabapmatt","weight":1000},{"account":"steemplus-pay","weight":500}]}]]}
  /**
   * Requests to broadcast a blog post/comment
   * @param {String} account Steem account to perform the request
   * @param {String} title Title of the blog post
   * @param {String} body Content of the blog post
   * @param {String} parent_perm Permlink of the parent post. Main tag for a root post
   * @param {String} parent_account Author of the parent post. Pass null for root post
   * @param {Object} json_metadata Parameters of the call
   * @param {String} permlink Permlink of the blog post
   * @param {Object} comment_options Options attached to the blog post. Consult Steem documentation to learn more about it
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestPost: function (
    account,
    title,
    body,
    parent_perm,
    parent_account,
    json_metadata,
    permlink,
    comment_options,
    callback,
    rpc,
  ) {
    var request = {
      type: 'post',
      username: account,
      title,
      body,
      parent_perm,
      parent_username: parent_account,
      json_metadata,
      permlink,
      comment_options,
      rpc,
    };
    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Requests a vote
   * @param {String} account Steem account to perform the request
   * @param {String} permlink Permlink of the blog post
   * @param {String} author Author of the blog post
   * @param {String} weight Weight of the vote, comprised between -10,000 (-100%) and 10,000 (100%)
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestVote: function (account, permlink, author, weight, callback, rpc) {
    var request = {
      type: 'vote',
      username: account,
      permlink,
      author,
      weight,
      rpc,
    };

    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Requests a custom JSON broadcast
   * @param {String} [account=null] Steem account to perform the request. If null, user can choose the account from a dropdown
   * @param {String} id Type of custom_json to be broadcasted
   * @param {String} key Type of key. Can be 'Posting','Active' or 'Memo'
   * @param {String} json Stringified custom json
   * @param {String} display_msg Message to display to explain to the user what this broadcast is about
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestCustomJson: function (
    account,
    id,
    key,
    json,
    display_msg,
    callback,
    rpc,
  ) {
    var request = {
      type: 'custom',
      username: account,
      id: id, //can be "custom", "follow", "reblog" etc.
      method: key, // Posting key is used by default, active can be specified for id=custom .
      json: json, //content of your json
      display_msg: display_msg,
      rpc,
    };

    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Requests a transfer
   * @param {String} account Steem account to perform the request
   * @param {String} to Steem account to receive the transfer
   * @param {String} amount Amount to be transfered. Requires 3 decimals.
   * @param {String} memo The memo will be automatically encrypted if starting by '#' and the memo key is available on Keychain. It will also overrule the account to be enforced, regardless of the 'enforce' parameter
   * @param {String} currency 'STEEM' or 'SBD'
   * @param {function} callback Keychain's response to the request
   * @param {boolean} [enforce=false] If set to true, user cannot chose to make the transfer from another account
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestTransfer: function (
    account,
    to,
    amount,
    memo,
    currency,
    callback,
    enforce = false,
    rpc,
  ) {
    var request = {
      type: 'transfer',
      username: account,
      to,
      amount,
      memo,
      enforce,
      currency,
      rpc,
    };
    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Requests a token transfer
   * @param {String} account Steem account to perform the request
   * @param {String} to Steem account to receive the transfer
   * @param {String} amount Amount to be transfered. Requires 3 decimals.
   * @param {String} memo Memo attached to the transfer
   * @param {String} currency Token to be sent
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestSendToken: function (
    account,
    to,
    amount,
    memo,
    currency,
    callback,
    rpc,
  ) {
    var request = {
      type: 'sendToken',
      username: account,
      to,
      amount,
      memo,
      currency,
      rpc,
    };
    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Requests a delegation broadcast
   * @param {String} [account=null] Steem account to perform the request. If null, user can choose the account from a dropdown
   * @param {String} delegatee Account to receive the delegation
   * @param {number} amount Amount to be transfered. Requires 3 decimals for SP, 6 for VESTS.
   * @param {String} unit SP or VESTS
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestDelegation: function (
    username,
    delegatee,
    amount,
    unit,
    callback,
    rpc,
  ) {
    var request = {
      type: 'delegation',
      username,
      delegatee,
      amount,
      unit,
      rpc,
    };
    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Requests a witness vote broadcast
   * @param {String} [account=null] Steem account to perform the request. If null, user can choose the account from a dropdown
   * @param {String} witness Account to receive the witness vote
   * @param {boolean} vote Set to true to vote for the witness, false to unvote
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestWitnessVote: function (username, witness, vote, callback, rpc) {
    var request = {
      type: 'witnessVote',
      username,
      witness,
      vote,
      rpc,
    };
    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Select an account as proxy
   * @param {String} [account=null] Steem account to perform the request. If null, user can choose the account from a dropdown
   * @param {String} proxy Account to become the proxy. Empty string ('') to remove a proxy
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestProxy: function (username, proxy, callback, rpc) {
    console.log(username, proxy);
    var request = {
      type: 'proxy',
      username,
      proxy,
      rpc,
    };
    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Request a power up
   * @param {String} username Steem account to perform the request
   * @param {String} recipient Account to receive the power up
   * @param {number} steem Amount of STEEM to be powered up
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestPowerUp: function (username, recipient, steem, callback, rpc) {
    var request = {
      type: 'powerUp',
      username,
      recipient,
      steem,
      rpc,
    };
    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Request a power down
   * @param {String} username Steem account to perform the request
   * @param {number} steem_power Amount of STEEM to be powered down
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestPowerDown: function (username, steem_power, callback, rpc) {
    var request = {
      type: 'powerDown',
      username,
      steem_power,
      rpc,
    };
    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Request the creation of an account using claimed tokens
   * @param {String} username Steem account to perform the request
   * @param {String} new_account New account to be created
   * @param {object} owner owner authority object
   * @param {object} active active authority object
   * @param {object} posting posting authority object
   * @param {String} memo public memo key
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestCreateClaimedAccount: function (
    username,
    new_account,
    owner,
    active,
    posting,
    memo,
    callback,
    rpc,
  ) {
    const request = {
      type: 'createClaimedAccount',
      username,
      new_account,
      owner,
      active,
      posting,
      memo,
      rpc,
    };

    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },

  //HF21
  /**
   * Request the creation of a DHF proposal
   * @param {String} username Steem account to perform the request
   * @param {String} receiver Account receiving the funding if the proposal is voted
   * @param {String} subject Title of the DAO
   * @param {String} permlink Permlink to the proposal description
   * @param {number} daily_pay Daily amount to be received by 'receiver'
   * @param {Date} start Starting date
   * @param {Date} end Ending date
   * @param {String} extensions Stringified Array of extensions
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestCreateProposal: function (
    username,
    receiver,
    subject,
    permlink,
    daily_pay,
    start,
    end,
    extensions,
    callback,
    rpc,
  ) {
    const request = {
      type: 'createProposal',
      username,
      receiver,
      subject,
      permlink,
      start,
      end,
      daily_pay,
      extensions,
      rpc,
    };

    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Request the removal of a DHF proposal
   * @param {String} username Steem account to perform the request
   * @param {String} proposal_ids Stringified Array of ids of the proposals to be removed
   * @param {String} extensions Stringified Array of extensions
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestRemoveProposal: function (
    username,
    proposal_ids,
    extensions,
    callback,
    rpc,
  ) {
    const request = {
      type: 'removeProposal',
      username,
      proposal_ids,
      extensions,
      rpc,
    };

    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Vote/Unvote a DHF proposal
   * @param {String} username Steem account to perform the request
   * @param {String} proposal_ids Stringified Array of Ids of the proposals to be voted
   * @param {boolean} approve Set to true to support the proposal, false to remove a vote
   * @param {String} extensions Stringified Array of extensions
   * @param {function} callback Keychain's response to the request
   * @param {String} [rpc=null] Override user's RPC settings
   */
  requestUpdateProposalVote: function (
    username,
    proposal_ids,
    approve,
    extensions,
    callback,
    rpc,
  ) {
    const request = {
      type: 'updateProposalVote',
      username,
      proposal_ids,
      approve,
      extensions,
      rpc,
    };

    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  /**
   * Add a new account to Keychain
   * @param {String} username username of the account to be added
   * @param {Object} keys private keys of the account : {active:'...',posting:'...',memo:'...'}. At least one must be specified.
   */
  requestAddAccount: function (username, keys, callback) {
    const request = {
      type: 'addAccount',
      username,
      keys,
    };

    this.dispatchCustomEvent('swRequest_steem', request, callback);
  },
  // Send the customEvent
  dispatchCustomEvent: function(name, data, callback)  {
    data.domain = window.location.href;
    this.requests[this.current_id] = callback;
    const obj = {
      name,
      request_id: this.current_id,
      data,
    };
    window.ReactNativeWebView.postMessage(JSON.stringify(obj));
    this.current_id++;
  },

  // Receive answer
  onAnswerReceived : function(type, response){
    if (type && type === 'steem_keychain_response') {
      if (response && response.request_id) {
        if (this.requests[response.request_id]) {
          this.requests[response.request_id](response);
          delete this.requests[response.request_id];
        }
      }
    } else if (type && type === 'steem_keychain_handshake') {
      if (steem_keychain.handshake_callback) {
        this.handshake_callback();
      }
    }
  }
};
`;
