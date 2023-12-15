import axios from "axios";

export function apiHandleError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const code = error.response.data.code;
      switch (code) {
        case "registered_user_id":
          return "入力されたユーザーIDは既に利用されています。別のユーザーIDでの登録をお願いします。";
        case "already_in_group":
          return "すでに所属するグループに加入することはできません。";
        case "categorys_len_zero":
          return "カテゴリーを全て削除することは出来ません。";
        case "bill_user_expense_un_match":
          return "立替額の合計が支出の金額と一致しません。一致するように入力してください。";
        case "pre_password_credentials":
          return "変更前のパスワードが間違っているため、更新できませんでした。";
        case "un_liquidation_no_user_delete":
          return "未精算データが残っているため退会できません。精算画面より残っている全ての精算を完了させてください。";
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
