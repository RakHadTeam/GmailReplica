import SearchBar from "../SearchBar/SearchBar";
import InboxHeaderControls from "./InboxHeaderControls";
import LabelPopupWrapper from "./LabelPopupWrapper";
import useUIs from "../../hooks/useUIs";

export default function InboxHeader() {
    const { showLabelPopup } = useUIs();

    return (
        <>
            <SearchBar />
            <InboxHeaderControls />
            {showLabelPopup && <LabelPopupWrapper />}
        </>
    );
}
