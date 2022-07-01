import { useContext, useState } from 'react';
import { Button, Form, Stack, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import callApi, { callApiWithToken } from '../../utils/fetchAbsolute';
import { useAuthToken } from '../../hooks/useAuthToken';
import { PlaceBidCommand } from '../../model/placeBidCommand';
import { UserContext } from '../../context/UserContext';
import AuctionField from './AuctionField';

type BidsProps = {
  selectedProductId?: string | null;
  bids?: BidDto[] | null;
  onBidPlaced: (amount: number) => void;
  onUpdateBid: (email: string, amount: number) => void;
};

export type BidDto = {
  Amount: number;
  Name: string;
  Email: string;
  Mobile: string;
};

const Bids = (props: BidsProps) => {
  const [selectedBidEmail, setSelectedBidEmail] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const userContext = useContext(UserContext);
  const authToken = useAuthToken();

  const onChangeBidAmount = (value: string | number) => {
    setAmount(value as number);
  };

  const onChangeSelectedBid = (email: string) => {
    return () => {
      setSelectedBidEmail(email);
    };
  };

  const validateSelectedProductId = (): boolean => {
    if (
      props.selectedProductId === undefined ||
      props.selectedProductId === null
    ) {
      toast('Select a product first.', {
        type: 'info',
      });
      return false;
    }
    return true;
  };

  const updateBidHandler = async () => {
    if (!validateSelectedProductId()) return;
    if (selectedBidEmail === null) {
      toast('Select a bid first.', {
        type: 'info',
      });
      return;
    }
    if (selectedBidEmail !== userContext.user?.email) {
      toast('Cannot update other user bid.', {
        type: 'warning',
      });
      return;
    }
    var response = await callApi(
      `/auction/api/v1/buyer/update-bid/${props.selectedProductId}/${selectedBidEmail}/${amount}`,
      {
        method: 'POST',
      }
    );
    if (response.ok) {
      props.onUpdateBid(selectedBidEmail, amount);
    } else {
      const error: any = JSON.parse(await response.text());
      toast(error.title, { type: 'error' });
    }
  };

  const placeBidHandler = async () => {
    if (!validateSelectedProductId()) return;
    const placeBidCommand: PlaceBidCommand = {
      bidAmount: amount,
      productId: props.selectedProductId,
      address: userContext.user?.address,
      city: userContext.user?.city,
      email: userContext.user?.email,
      firstName: userContext.user?.firstName,
      lastName: userContext.user?.lastName,
      phone: userContext.user?.phone,
      pin: userContext.user?.pin,
      state: userContext.user?.state,
    };
    var response = await callApiWithToken(authToken!,`/auction/api/v1/buyer/place-bid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(placeBidCommand),
    });
    if (response.ok) {
      props.onBidPlaced(amount);
    } else {
      const error = JSON.parse(await response.text());
      toast(error.title, { type: 'error' });
    }
  };

  return (
    <>
      <h3>Bids</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Bid amount</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
          </tr>
        </thead>
        <tbody>
          {props.bids?.map((x) => (
            <tr key={x.Email} onClick={onChangeSelectedBid(x.Email)} className={selectedBidEmail === x.Email ? "selected-row" : ""}>
              <td>{x.Amount}</td>
              <td>{x.Name}</td>
              <td>{x.Email}</td>
              <td>{x.Mobile}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Form>
        <AuctionField
          controlId={'amountId'}
          label={'Bid amount'}
          onChange={onChangeBidAmount}
          value={amount}
        ></AuctionField>
        <Stack direction="horizontal" gap={3}>
          <Button
            variant="primary"
            className="ms-auto"
            type="button"
            onClick={updateBidHandler}
          >
            Update bid
          </Button>
          <Button variant="primary" type="button" onClick={placeBidHandler}>
            Place bid
          </Button>
        </Stack>
      </Form>
    </>
  );
};

export default Bids;
