import { ChangeEvent } from "react"
import { Form } from "react-bootstrap"

type SelectProductProps = {
  products?: SelectProductDto[];
  value?: string;
  onChangeProduct: (productId: string) => void;
}

export type SelectProductDto = {
  productId: string;
  productName: string;
}

const SelectProduct = (props: SelectProductProps) => {
  const changeProductHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    props.onChangeProduct(event.target.value);
  }

  return <Form.Select aria-label="Select product" onChange={changeProductHandler} value={props.value}>
      <option>Select product...</option>
      {props.products?.map(m => <option key={m.productId} value={m.productId}>{m.productName}</option>)}
    </Form.Select>
}

export default SelectProduct;