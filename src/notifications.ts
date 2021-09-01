import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";

export const NotificationContainer = styled(ToastContainer)`
    .Toastify__toast {
        color: #fff;

        &.Toastify__toast--info {
            background-color: ${(props) => props.theme.colours.currant};
        }
        &.Toastify__toast--success {
            background-color: ${(props) => props.theme.colours.positive};
        }
        &.Toastify__toast--error {
            background-color: ${(props) => props.theme.colours.negative};
        }
    }
`;

export const notify = {
    neutral: (message: string) => toast.info(message),
    positive: (message: string) => toast.success(message),
    negative: (message: string) => toast.error(message),
};

export default notify;
