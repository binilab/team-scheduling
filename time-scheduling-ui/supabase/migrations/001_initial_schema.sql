CREATE TABLE polls (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    duration INT NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    poll_id INT REFERENCES polls(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE availability (
    id SERIAL PRIMARY KEY,
    participant_id INT REFERENCES participants(id) ON DELETE CASCADE,
    available_start TIMESTAMP NOT NULL,
    available_end TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    poll_id INT REFERENCES polls(id) ON DELETE CASCADE,
    participant_id INT REFERENCES participants(id) ON DELETE CASCADE,
    selected_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);