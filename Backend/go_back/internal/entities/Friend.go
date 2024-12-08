package entities

type FriendRequest struct {
	ID            int     `json:"id,omitempty"`             // Уникальный идентификатор запроса
	SenderID      int     `json:"sender_id,omitempty"`      // ID пользователя, который отправил запрос
	ReceiverID    int     `json:"receiver_id,omitempty"`    // ID пользователя, который получил запрос
	SenderLogin   string  `json:"sender_login,omitempty"`   // Логин отправителя
	ReceiverLogin string  `json:"receiver_login,omitempty"` // Логин получателя
	SenderPfp     string  `json:"sender_pfp,omitempty"`     // Аватарка отправителя
	ReceiverPfp   *string `json:"receiver_pfp,omitempty"`   // Аватарка получателя
}
