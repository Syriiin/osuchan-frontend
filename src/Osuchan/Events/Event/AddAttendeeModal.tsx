import React, { useState } from "react";
import { observer } from "mobx-react-lite";

import { SimpleModal, SimpleModalTitle, FormLabel, TextInput, Button } from "../../../components";
import { useStore } from "../../../utils/hooks";

const AddAttendeeModal = observer((props: AddAttendeeModalProps) => {
    const store = useStore();
    const eventsStore = store.eventsStore;

    const [userId, setUserId] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsed = parseInt(userId);
        if (!isNaN(parsed)) {
            eventsStore.addAttendee(props.slug, parsed);
            setUserId("");
            props.onClose();
        }
    };

    return (
        <SimpleModal open={props.open} onClose={props.onClose} keepMounted>
            <SimpleModalTitle>Add Attendee</SimpleModalTitle>
            <form onSubmit={handleSubmit}>
                <FormLabel>osu! User ID</FormLabel>
                <TextInput
                    $fullWidth
                    required
                    type="text"
                    placeholder="5701575"
                    value={userId}
                    onChange={(e) => {
                        const val = e.currentTarget.value;
                        if (/^\d*$/.test(val)) {
                            setUserId(val);
                        }
                    }}
                />
                <Button $positive type="submit" isLoading={eventsStore.isAddingAttendee}>
                    Add
                </Button>
            </form>
        </SimpleModal>
    );
});

interface AddAttendeeModalProps {
    open: boolean;
    onClose: () => void;
    slug: string;
}

export default AddAttendeeModal;
