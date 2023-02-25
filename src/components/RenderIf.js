const RenderIf = ({ isTrue, children }) => {
  return isTrue ? children : null;
};

export default RenderIf;