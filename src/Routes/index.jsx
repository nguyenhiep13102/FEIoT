import homenew from "../pages/HomeNew";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";


import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";

import ListFanIoT from "../pages/ListFanIoT/index";
import profilePages from "../pages/ProfilePages/ProfilePages";
import detailDevIoT from "../pages/detailIoTdev/index";
export const routes = [
  {
    path: "/",
    page: homenew,
    isShowHeader: true,
  },

  {
    path: "/detailDevIoT/:id",
    page: detailDevIoT,
    isShowHeader: true,
  },

  {
    path: "/ListFanIoT",
    page: ListFanIoT,
    isShowHeader: true,
  },
 {
    path: "/profile-Pages",
    page: profilePages,
    isShowHeader: true,
  },

  {
    path: "/sign-in",
    page: SignInPage,
    isShowHeader: false,
  },
  {
    path: "/sign-up",
    page: SignUpPage,
    isShowHeader: false,
  },

  {
    path: "/*",
    page: NotFoundPage,
    isShowHeader: false,
  },
];
