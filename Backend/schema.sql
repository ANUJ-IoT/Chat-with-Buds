CREATE TABLE IF NOT EXISTS users (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username      VARCHAR(20) NOT NULL UNIQUE,
  password      TEXT NOT NULL,
  email         VARCHAR(40) NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       VARCHAR(50) UNIQUE,
  conversation_type VARCHAR(10) NOT NULL 
    CHECK(conversation_type IN ('private', 'group')),
  created_by  BIGINT, 
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT conversations_created_by_fkey 
    FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id         BIGSERIAL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  conversation_id  BIGINT NOT NULL,
  sender_id    BIGINT NOT NULL,
  message_type VARCHAR(10) DEFAULT 'text' CHECK(message_type IN ('text', 'image', 'file')),
  created_at TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP,
  content    TEXT NOT NULL,
  edited_at  TIMESTAMPTZ, 

  CONSTRAINT uq_messages_conversation_id_id
    UNIQUE (conversation_id, id),

  CONSTRAINT messages_conversation_id_fkey
    FOREIGN KEY (conversation_id)
    REFERENCES conversations(id)
    ON DELETE CASCADE, 

  CONSTRAINT messages_sender_id_fkey
    FOREIGN KEY (sender_id)
    REFERENCES users(id)
    ON DELETE CASCADE, 

  CONSTRAINT fk_message_sender_membership
    FOREIGN KEY (conversation_id, sender_id)
    REFERENCES conversation_members(conversation_id, user_id)
 );

CREATE TABLE IF NOT EXISTS conversation_members(
  conversation_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  roleIs  VARCHAR(10) DEFAULT 'member' CHECK(roleIs IN ('admin', 'member')),  
  joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, 

  PRIMARY KEY (conversation_id, user_id), 

  CONSTRAINT conversation_members_conversation_id_fkey
    FOREIGN KEY (conversation_id)
    REFERENCES conversations(id)
    ON DELETE CASCADE, 

  CONSTRAINT conversation_members_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS message_receipts(
  message_id BIGINT NOT NULL, 
  user_id BIGINT NOT NULL, 
  delivered_at TIMESTAMPTZ, 
  read_at TIMESTAMPTZ, 
  conversation_id BIGINT NOT NULL, 

  PRIMARY KEY (message_id, user_id),

  CONSTRAINT fk_receipt_message_conversation
    FOREIGN KEY (conversation_id, message_id)
    REFERENCES messages(conversation_id, id)
    ON DELETE CASCADE, 


  CONSTRAINT message_receipts_message_id_fkey
    FOREIGN KEY (message_id)
    REFERENCES messages(id)
    ON DELETE CASCADE, 

  CONSTRAINT fk_receipt_user_membership
    FOREIGN KEY (conversation_id, user_id)
    REFERENCES conversation_members(conversation_id, user_id)
    ON DELETE CASCADE, 


  CONSTRAINT message_receipts_user_id_fkey  
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- INDEXES

-- CONVERSATIONS

CREATE INDEX IF NOT EXISTS idx_conversations_created_by
ON conversations (created_by);


-- CONVERSATION MEMBERS

CREATE INDEX IF NOT EXISTS idx_conversation_members_user_id
ON conversation_members (user_id, conversation_id);


-- MESSAGES

CREATE INDEX IF NOT EXISTS idx_messages_conversation_history
ON messages (conversation_id, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_messages_sender
ON messages (sender_id);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_sender
ON messages (conversation_id, sender_id);


-- MESSAGE RECEIPTS

CREATE INDEX IF NOT EXISTS idx_receipts_conversation_message
ON message_receipts (conversation_id, message_id);

CREATE INDEX IF NOT EXISTS idx_receipts_conversation_user
ON message_receipts (conversation_id, user_id);

CREATE INDEX IF NOT EXISTS idx_receipts_user_id
ON message_receipts (user_id);