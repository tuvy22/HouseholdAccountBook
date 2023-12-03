import axios from "axios";

export const GET_NG_MESSAGE = "データの取得に失敗しました。";
export const POST_NG_MESSAGE = "データの送信に失敗しました。";
export const PUT_NG_MESSAGE = "データの更新に失敗しました。";
export const DELETE_NG_MESSAGE = "データの削除に失敗しました。";

export function apiHandleError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const code = error.response.data.code;
      switch (code) {
        case "already_in_group":
          return "すでに所属するグループに加入することはできません。";
        case "invalid_credentials":
          return "認証に失敗しました。";
        case "invalid_login":
          return "IDまたはパスワードが間違っています。";
        case "internal_server_error":
          return "サーバーでエラーが発生しました。";
        case "bad_request":
          return "リクエストに不正な内容があります。";
        default:
          return "予期せぬエラーが発生しました。";
      }
    } else if (error.request) {
      return "サーバーに接続できませんでした。";
    } else {
      return "送信中にエラーが発生しました。";
    }
  }
  return "送信中にエラーが発生しました。";
}
