/**
 * Auction.View.API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ShowProductsResponseProductDto } from './showProductsResponseProductDto';


export interface PagedListShowProductsResponseProductDto { 
    currentPage?: number;
    pageSize?: number;
    totalPages?: number;
    totalCount?: number;
    readonly hasPrevious?: boolean;
    readonly hasNext?: boolean;
    results?: Array<ShowProductsResponseProductDto> | null;
}

