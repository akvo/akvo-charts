import './style.css';

const SnackBar = ({ children, show = false }) => (
  <div
    id="snackbar"
    className={`${show ? 'show' : ''} text-lg`}
  >
    {children}
  </div>
);

export default SnackBar;
