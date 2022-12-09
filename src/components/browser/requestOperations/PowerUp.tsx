import {KeyTypes} from 'actions/interfaces';
import React from 'react';
import {powerUp} from 'utils/hive';
import {RequestId, RequestPowerUp} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestPowerUp & RequestId;
} & RequestComponentCommonProps;
export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {username, recipient: to, steem} = data;

  return (
    <RequestOperation
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.power_up', {
        steem,
        to,
      })}
      beautifyError
      method={KeyTypes.active}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys.active;
        return await powerUp(key, {
          from: username,
          to,
          amount: `${steem} STEEM`,
        });
      }}>
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem title={translate('request.item.to')} content={`@${to}`} />
      <RequestItem
        title={translate('request.item.amount')}
        content={`${steem} STEEM`}
      />
    </RequestOperation>
  );
};
