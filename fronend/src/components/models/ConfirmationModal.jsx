const ConfirmationModal = ({
  show,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
}) => {
  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: for a dimmed background
        }}
      >
        <div
          className="modal-dialog"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="modal-content shadow">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <p>{message}</p>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>

              <button className="btn btn-danger" onClick={onConfirm}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background overlay */}
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default ConfirmationModal;
