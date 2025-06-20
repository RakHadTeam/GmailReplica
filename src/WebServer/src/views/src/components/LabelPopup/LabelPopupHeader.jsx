export default function LabelPopupHeader({ closeLabelPopup }) {
    return (
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 className="m-0">Labels</h5>
            <button className="btn-close" onClick={closeLabelPopup}></button>
        </div>
    );
}
