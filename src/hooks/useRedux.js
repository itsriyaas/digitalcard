// src/hooks/useRedux.js
import { useDispatch, useSelector } from "react-redux";

export const useRedux = () => {
  return {
    dispatch: useDispatch(),
    selector: useSelector,
  };
};
