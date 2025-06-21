export default function LabelPopupFooter({ onCreateClick, onManageClick }) {
    return (
        <div className="border-top pt-2 mx-3 mb-3">
            <button
                className="btn btn-link text-decoration-none w-100 text-start"
                onClick={onCreateClick}
            >
                Create new
            </button>
            <button
                className="btn btn-link text-decoration-none w-100 text-start"
                onClick={onManageClick}
            >
                Manage labels
            </button>
        </div>
    );
}
