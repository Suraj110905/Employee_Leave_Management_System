import PropTypes from "prop-types";

export default function PageContainer({ children, className = "" }) {
  return (
    <div className={`p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in ${className}`}>
      {children}
    </div>
  );
}

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
