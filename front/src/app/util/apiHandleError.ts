import axios from "axios";

export function apiHandleError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const code = error.response.data.code;
      switch (code) {
        case "already_in_group":
          return "すでに所属するグループに加入することはできません。";
        case "categorys_len_zero":
          return "カテゴリーを全て削除することは出来ません。";
        case "bill_user_expense_un_match":
          return "立替額の合計が支出の金額と一致しません。一致するように入力してください。";
        case "invalid_credentials":
          return "認証に失敗しました。";
        case "invalid_login":
          return "IDまたはパスワードが間違っています。";
        case "bad_request":
          return "リクエストに不正な内容があります。";
        case "no_session":
          return "ログインのセッションが存在しません。ログインし直してください。";
        case "internal_server_error":
          return "サーバーでエラーが発生しました。";
        default:
          return "想定外のエラーが発生しました。";
      }
    } else if (error.request) {
      return "サーバーに接続できませんでした。";
    } else {
      return "送信中にエラーが発生しました。";
    }
  }
  return "送信中にエラーが発生しました。";
}
