import React from 'react';
import CustomModal from 'components/modals/CustomModal';

export default ({navigation, route}) => {
  const onForceCloseModal = route.params
    ? route.params.onForceCloseModal
    : null;
  console.log(onForceCloseModal, route.params);
  return (
    <CustomModal
      outsideClick={
        onForceCloseModal ||
        (() => {
          navigation.goBack();
        })
      }
      bottomHalf={true}>
      {route.params && route.params.modalContent}
    </CustomModal>
  );
};
