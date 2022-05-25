import React, {
  ChangeEvent,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Button, Col, Form, Row, Stack } from 'react-bootstrap';
import { Category } from '../../model/category';
import { CreateProductCommand } from '../../model/createProductCommand';
import { ShowProductsResponse } from '../../model/showProductsResponse';
import { ShowProductsResponseProductDto } from '../../model/showProductsResponseProductDto';
import Bids, { BidDto } from './Bids';
import AuctionField from './AuctionField';
import SelectProduct, { SelectProductDto } from './SelectProduct';
import { toast } from 'react-toastify';
import { ShowProductsResponseBidDto } from '../../model/showProductsResponseBidDto';
import { ShowProductDetailsResponse } from '../../model/showProductDetailsResponse';
import { UserContext } from '../login/UserContext';

type ProductDetailsProps = {
  onProductCreated?: () => void;
};

const ProductDetails = (props: ProductDetailsProps) => {
  // const [productName, setProductName] = useState<string | null>(null);
  // const [shortDescription, setShortDescription] = useState<string | null>(null);
  // const [detailedDescription, setDetailedDescription] = useState<string | null>(null);
  const [product, setProduct] = useState<ShowProductsResponseProductDto>(
    {} as ShowProductsResponseProductDto
  );
  const [productList, setProductList] = useState<
    ShowProductsResponseProductDto[]
  >([]);
  const userContext = useContext(UserContext);

  const categories = [Category.Painting, Category.Sculptor, Category.Ornament];

  const onChangeProductName = (value: string | number) => {
    setProduct({ ...product, productName: value as string });
  };

  const onChangeShortDescription = (value: string | number) => {
    setProduct({ ...product, shortDescription: value as string });
  };

  const onChangeDetailedDescription = (value: string | number) => {
    setProduct({ ...product, detailedDescription: value as string });
  };

  const onChangeCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    setProduct({ ...product, categoryType: event.target.value as Category });
  };

  const onChangeStartingPrice = (value: string | number) => {
    setProduct({ ...product, startingPrice: value as number });
  };

  const onChangeBidEndDate = (value: string | number) => {
    setProduct({ ...product, bidEndDate: value as string });
  };

  const createProductHandler = async () => {
    const createProductCommand: CreateProductCommand = {
      bidEndDate: product.bidEndDate,
      categoryType: product.categoryType,
      detailedDescription: product.detailedDescription,
      productName: product.productName,
      shortDescription: product.shortDescription,
      startingPrice: product.startingPrice,
      sellerInformation: {
        address: userContext.user?.address,
        city: userContext.user?.city,
        email: userContext.user?.email,
        firstName: userContext.user?.firstName,
        lastName: userContext.user?.lastName,
        phone: userContext.user?.phone,
        pin: userContext.user?.pin,
        state: userContext.user?.state,
      },
    };
    var response = await fetch('/auction/api/v1/seller/add-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createProductCommand),
    });
    if (response.ok) {
      const productId = await response.text();
      const productDto = { ...product };
      productDto.productId = productId;
      productDto.bidEndDate = new Date(productDto.bidEndDate!).toJSON();
      productDto.sellerInformation = {
        address: userContext.user?.address,
        city: userContext.user?.city,
        email: userContext.user?.email,
        firstName: userContext.user?.firstName,
        lastName: userContext.user?.lastName,
        phone: userContext.user?.phone,
        pin: userContext.user?.pin,
        state: userContext.user?.state,
      };
      setProductList([...productList, productDto]);
      setProduct(productDto);
      toast(`Product created '${productDto.productName}'`, {
        type: 'info',
      });
      if (props.onProductCreated) {
        props.onProductCreated();
      }
    } else {
      const error = JSON.parse(await response.text());
      toast(error.title, {
        type: 'error',
      });
    }
  };

  const deleteProductHandler = async () => {
    if (product.productId === undefined || product.productId === null) {
      toast('Select a product first.', {
        type: 'info',
      });
      return;
    }
    var response = await fetch(
      `/auction/api/v1/seller/delete/${product.productId}`,
      {
        method: 'POST',
      }
    );
    if (response.ok) {
      setProduct({});
      const lessProducts = productList.filter(
        (x) => x.productId !== product.productId
      );
      setProductList(lessProducts);
      toast('Product deleted.', {
        type: 'success',
      });
    } else {
      const error = JSON.parse(await response.text());
      toast(error.title, {
        type: 'error',
      });
    }
  };

  const fetchProducts = useCallback(async () => {
    const response = await fetch('/auctionview/api/v1/seller/show-products');
    if (response.ok) {
      const productList: ShowProductsResponse = await response.json();
      setProductList(productList.products?.results ?? []);
    } else {
      var error = await response.text();
      toast(error, {
        type: 'error',
      });
    }
  }, []);

  const changeProductHandler = async (productId: string) => {
    const response = await fetch(
      `/auctionview/api/v1/seller/show-product/${productId}`
    );
    if (response.ok) {
      const productDto: ShowProductDetailsResponse = await response.json();
      setProduct(productDto);
    } else {
      var error = await response.text();
      toast(error, {
        type: 'error',
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchProducts();
    };
    fetchData();
  }, [fetchProducts]);

  const placeBidHandler = (amount: number) => {
    const bidDto: ShowProductsResponseBidDto = {
      amount: amount,
      productId: product.productId,
      buyerInformation: {
        address: userContext.user?.address,
        city: userContext.user?.city,
        email: userContext.user?.email,
        firstName: userContext.user?.firstName,
        lastName: userContext.user?.lastName,
        phone: userContext.user?.phone,
        pin: userContext.user?.pin,
        state: userContext.user?.state,
      },
    };
    const bids = [...(product.bids ?? []), bidDto].sort(
      (a, b) => (b.amount ?? 0) - (a.amount ?? 0)
    );
    setProduct({ ...product, bids: bids });
  };

  const updateBidHandler = (email: string, amount: number) => {
    const productBidIndex = product.bids?.findIndex(
      (x) => x.buyerInformation!.email === email
    );
    if (productBidIndex === undefined || productBidIndex === -1) return;

    let bids = [...product.bids!];
    bids = [
      ...bids.slice(0, productBidIndex),
      {
        ...bids[productBidIndex],
        amount: amount,
      },
      ...bids.slice(productBidIndex + 1),
    ];
    bids = bids.sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0));
    setProduct({
      ...product,
      bids: bids,
    });
  };

  return (
    <Fragment>
      <Row>
        <Col>
          <h2>Product</h2>
        </Col>
        <Col>
          <SelectProduct
            onChangeProduct={changeProductHandler}
            value={product.productId === null ? undefined : product.productId}
            products={productList?.map<SelectProductDto>((x) => ({
              productId: x.productId!,
              productName: x.productName!,
            }))}
          ></SelectProduct>
        </Col>
      </Row>
      <Form>
        <Row>
          <AuctionField
            controlId={'productNameId'}
            label={'Product name'}
            onChange={onChangeProductName}
            value={product.productName!}
          ></AuctionField>
        </Row>
        <Row>
          <AuctionField
            controlId={'shortDescriptionId'}
            label={'Short description'}
            onChange={onChangeShortDescription}
            value={product.shortDescription!}
          ></AuctionField>
        </Row>
        <Row>
          <AuctionField
            controlId={'detailedDescriptionId'}
            label={'Detailed description'}
            onChange={onChangeDetailedDescription}
            value={product.detailedDescription!}
          ></AuctionField>
        </Row>
        <Row>
          <Form.Group className="mb-3" controlId={'categoryId'}>
            <Form.Label>Category</Form.Label>
            <Form.Select
              aria-label="Select category"
              onChange={onChangeCategory}
              value={product.categoryType}
            >
              {categories?.map((m) => (
                <option key={m.toString()} value={m.toString()}>
                  {m.toString()}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>
        <Row>
          <AuctionField
            controlId={'startingPriceId'}
            label={'Starting price'}
            onChange={onChangeStartingPrice}
            value={product.startingPrice}
          ></AuctionField>
        </Row>
        <Row>
          <AuctionField
            controlId={'bidEndDateId'}
            label={'Bid end date'}
            placeholder={'e.g. 2022-05-31T18:00:00'}
            onChange={onChangeBidEndDate}
            value={product.bidEndDate}
          ></AuctionField>
        </Row>
        <Stack direction="horizontal" gap={3}>
          <Button
            variant="danger"
            className="ms-auto"
            type="button"
            onClick={deleteProductHandler}
          >
            Delete product
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={createProductHandler}
          >
            Create product
          </Button>
        </Stack>
      </Form>
      <Bids
        onBidPlaced={placeBidHandler}
        onUpdateBid={updateBidHandler}
        selectedProductId={product.productId}
        bids={product.bids?.map<BidDto>((x) => ({
          Amount: x.amount!,
          Name: x.buyerInformation!.firstName!,
          Email: x.buyerInformation!.email!,
          Mobile: x.buyerInformation!.phone!,
        }))}
      ></Bids>
    </Fragment>
  );
};

export default ProductDetails;
