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
import { ShowProductDetailsResponseUserDto } from './showProductDetailsResponseUserDto';


export interface ShowProductDetailsResponseBidDto { 
    createdDate?: string;
    updatedDate?: string | null;
    bidId?: number;
    amount?: number;
    userId?: number;
    productId?: string | null;
    buyerInformation?: ShowProductDetailsResponseUserDto;
}

