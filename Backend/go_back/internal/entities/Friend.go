package entities

type Friend struct {
	ID       int `json:"id,omitempty"`
	UserID   int `json:"user_id,omitempty"`
	FriendID int `json:"friend_id,omitempty"`
}
