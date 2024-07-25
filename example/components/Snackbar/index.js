import './style.css';

const SnackBar = ({ children, show = false }) => (
  <div
    id="snackbar"
    className={show ? 'show' : ''}
  >
    {children}
  </div>
);

export default SnackBar;
