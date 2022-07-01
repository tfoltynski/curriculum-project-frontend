import React, { ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';

type AuctionFieldProps = {
  controlId: string;
  placeholder?: string;
  label: string;
  value?: string | number;
  onChange: (value: string | number) => void;
};

const AuctionField = (props: AuctionFieldProps) => {
  const changeValue = (event: ChangeEvent<HTMLInputElement>) => {
    props.onChange(event.target.value);
  };
  return (
    <Form.Group className="mb-3" controlId={props.controlId}>
      <Form.Label>{props.label}</Form.Label>
      <Form.Control
        type="text"
        placeholder={props.placeholder}
        onChange={changeValue}
        value={props.value || ''}
      />
    </Form.Group>
  );
};

export default AuctionField;
