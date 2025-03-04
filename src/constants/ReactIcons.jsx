import { IoHome } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { BsPeopleFill } from "react-icons/bs";
import { BsPeople } from "react-icons/bs";
import { BsPlayBtnFill } from "react-icons/bs";
import { BsPlayBtn } from "react-icons/bs";
import { IoAppsSharp } from "react-icons/io5";
import { MdMessage } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { BsPersonCircle } from "react-icons/bs";
import { HiOutlineSearch } from "react-icons/hi";
import { FaSave } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";

import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";

import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";

import { IoSettingsSharp } from "react-icons/io5";
import { IoPeople } from "react-icons/io5";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { BsPersonLinesFill } from "react-icons/bs";
import { FaCamera } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";

export const ReactIcons = {
    HOME: <IoHome />,
    HOME_OUTLINED: <IoHomeOutline />,
    FRIEND: <BsPeopleFill />,
    FRIEND_OUTLINED: <BsPeople />,
    VIDEO: <BsPlayBtnFill />,
    VIDEO_OUTLINED: <BsPlayBtn />,
    SAVED: <FaSave />,
    MENU: <IoAppsSharp />,
    MESSAGE: <MdMessage />,
    NOTIFICATION: <IoNotifications />,
    PROFILE_AVATAR: <BsPersonCircle />,
    PROFILE_AVATAR_WITHOUT_CIRCLE: <IoPersonSharp />,
    SEARCH_MAGNIFYINGGLASS: <HiOutlineSearch />,
    CLOSE: <IoClose />,
    SMILE_EMOJI: <BsEmojiSmile />,

    // Home Page
    OPTIONS_THREE_DOTS: <IoEllipsisHorizontalSharp />,
    ADD_PLUS: <IoMdAdd />,
    DOWN: <FaAngleDown />,

    // Post Feed
    COMMENT: <FaRegCommentDots />,
    LIKE: <BiLike />,
    LIKE_OUTLINE: <BiSolidLike />,

    // Friends Page
    SETTING: <IoSettingsSharp />,
    FRIENDS_STYLE2: <IoPeople />,
    FRIENDS_REQUEST: <BsFillPersonPlusFill />,
    FRIENDS_LIST: <BsPersonLinesFill />,

    // Profile Page
    CAMERA: <FaCamera />,
};
