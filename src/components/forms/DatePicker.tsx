import React from "react";
import ReactDatePicker, { ReactDatePickerProps } from "react-datepicker";
import styled from "styled-components";

const DatePickerWrapper = styled.div`
    .react-datepicker__input {
        background-color: ${props => props.theme.colours.background};
        border-radius: 5px;
        padding: 10px;
        color: #fff;
        border-width: 0;
    }

    .react-datepicker__header {
        background-color: ${props => props.theme.colours.foreground};

        .react-datepicker__day-name, .react-datepicker__current-month {
            color: #fff;
        }
    }

    .react-datepicker__month-container {
        background-color: ${props => props.theme.colours.background};
        border-radius: 5px;

        .react-datepicker__day {
            color: #fff;
            border-radius: 5px;

            &:hover {
                color: #000;
            }

            &.react-datepicker__day--selected {
                background-color: ${props => props.theme.colours.mystic};
                color: #fff;
            }

            &.react-datepicker__day--keyboard-selected {
                background-color: ${props => props.theme.colours.currant};
                color: #fff;

                &:hover {
                    color: #000;
                    background-color: #fff;
                }
            }

            &.react-datepicker__day--today {
                border: 1px solid #fff;
                background-color: unset;

                &:hover {
                    color: #000;
                    background-color: #fff;
                }
            }
        }
    }
`;

export const DatePicker = (props: DatePickerProps) => (
    <DatePickerWrapper>
        <ReactDatePicker
            {...props}
            placeholderText="Click to select a date"
            className="react-datepicker__input"
        />
    </DatePickerWrapper>
);

interface DatePickerProps extends ReactDatePickerProps {}
