const Header = () => {
  return (
    <div className="grid grid-cols-3 text-quotehead text-sm p-1">
      <div className="text-center">Price(USD)</div>
      <div className="text-right">Size</div>
      <div className="text-right">Total</div>
    </div>
  );
};

export default Header;
