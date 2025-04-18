export type CredentialsProps = {
   credential?: string;
   select_by?:
      | "auto"
      | "user"
      | "user_1tap"
      | "user_2tap"
      | "btn"
      | "btn_confirm"
      | "btn_add_session"
      | "btn_confirm_add_session";
   clientId?: string;
};
