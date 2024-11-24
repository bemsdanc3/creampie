package entities

type User struct {
	ID          int     `json:"id,omitempty"`
	Login       string  `json:"login,omitempty"`
	Pass        string  `json:"pass,omitempty"`
	Pfp         *string `json:"pfp,omitempty"`
	Email       string  `json:"email,omitempty"`
	IsOnline    bool    `json:"is_online"`
	Description *string `json:"description,omitempty"`
	RegDate     string  `json:"reg_date,omitempty"`
	IsBlocked   bool    `json:"is_blocked"`
	IsBot       bool    `json:"is_bot"`
	BotToken    *string `json:"bot_token,omitempty"`
	Token       string  `json:"token,omitempty"`
}
