import { ActionType } from "./action";

const initialState = {
  standards: [],
  productInfo: null,
};

export default function productStandardReducer(state = initialState, action) {
  switch (action.type) {
    case ActionType.RECEIVE_PRODUCT_STANDARDS:
      return {
        ...state,
        standards: action.payload.data,
        productInfo: action.payload.product,
      };
    case ActionType.ADD_PRODUCT_STANDARD:
      return {
        ...state,
        standards: [...state.standards, action.payload],
      };
    case ActionType.UPDATE_PRODUCT_STANDARD:
      return {
        ...state,
        standards: state.standards.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case ActionType.DELETE_PRODUCT_STANDARD:
      return {
        ...state,
        standards: state.standards.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
}
