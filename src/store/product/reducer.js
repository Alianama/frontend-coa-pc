import { ActionType } from "./action";

const initialState = {
  products: [],
};

function productReducer(state = initialState, action) {
  switch (action.type) {
    case ActionType.RECEIVE_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };

    case ActionType.ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload],
      };

    case ActionType.ROLLBACK_ADD_PRODUCT:
      return {
        ...state,
        products: state.products.filter(
          (product) => product.id !== action.payload
        ),
      };

    case ActionType.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
      };

    case ActionType.ROLLBACK_UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
      };

    case ActionType.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(
          (product) => product.id !== action.payload
        ),
      };

    case ActionType.ROLLBACK_DELETE_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload],
      };

    default:
      return state;
  }
}

export default productReducer;
