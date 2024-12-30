const createModal = (id: string) => ({
  open: () => {
    (document.getElementById(id) as any).showModal();
  },
  close: () => {
    (document.getElementById(id) as any).close();
  },
  id: id,
});

const ModalHelpers = {
  notEnoughCoin: createModal('NOTENOUGHCOIN'),
  premiumPollPreview: createModal('PREMIUMPOLLPREVIEW'),
};

export default ModalHelpers;
