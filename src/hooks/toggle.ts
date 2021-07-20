let toggleElement: string = '0';

export const setToggleElement = (elt: string) => {
  toggleElement = elt;
};

export const getToggleElement = () =>
  toggleElement
    .replace('0', 'WalletScreen')
    .replace('1', 'EngineWalletScreen');
