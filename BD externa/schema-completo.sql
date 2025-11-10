
-- ============================================================
-- TransFácil - Schema Completo do Banco de Dados PostgreSQL
-- ============================================================
-- Este arquivo contém toda a estrutura do banco de dados
-- Pode ser executado em qualquer ambiente PostgreSQL

-- Criação do banco de dados (se necessário)
-- CREATE DATABASE transfacil;

-- Conectar ao banco
-- \c transfacil;

-- ============================================================
-- TABELAS DE AUTENTICAÇÃO E USUÁRIOS
-- ============================================================

-- Tabela de sessões (Replit Auth)
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions(expire);

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY NOT NULL,
    email VARCHAR UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    password_hash VARCHAR,
    auth_type VARCHAR DEFAULT 'oauth',
    is_admin BOOLEAN DEFAULT false,
    is_driver BOOLEAN DEFAULT false,
    driver_pending BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABELAS DE PERFIS
-- ============================================================

-- Perfis de estudantes
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    full_name VARCHAR NOT NULL,
    student_number VARCHAR NOT NULL UNIQUE,
    university VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT true,
    course VARCHAR,
    phone VARCHAR,
    is_verified BOOLEAN DEFAULT false,
    approval_status VARCHAR NOT NULL DEFAULT 'pending',
    approved_by VARCHAR REFERENCES users(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    address TEXT,
    qr_code VARCHAR UNIQUE,
    vehicle_make VARCHAR,
    vehicle_model VARCHAR,
    vehicle_color VARCHAR,
    vehicle_plate VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Perfis de motoristas (gerenciados por admin)
CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    full_name VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    license_number VARCHAR NOT NULL UNIQUE,
    approval_status VARCHAR NOT NULL DEFAULT 'pending',
    approved_by VARCHAR REFERENCES users(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Veículos (gerenciados por admin)
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id),
    make VARCHAR NOT NULL,
    model VARCHAR NOT NULL,
    color VARCHAR NOT NULL,
    plate VARCHAR NOT NULL UNIQUE,
    capacity INTEGER NOT NULL,
    year INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABELAS DE UNIVERSIDADES E PLANOS
-- ============================================================

-- Universidades
CREATE TABLE IF NOT EXISTS universities (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    code VARCHAR NOT NULL UNIQUE,
    address VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Planos de assinatura
CREATE TABLE IF NOT EXISTS subscription_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    duration VARCHAR NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    features JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Assinaturas de estudantes
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    plan_id INTEGER NOT NULL REFERENCES subscription_plans(id),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    trips_remaining INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABELAS DE ROTAS E TRANSPORTES
-- ============================================================

-- Rotas de ônibus
CREATE TABLE IF NOT EXISTS routes (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    origin VARCHAR NOT NULL,
    destination VARCHAR NOT NULL,
    estimated_duration INTEGER,
    stops JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ônibus
CREATE TABLE IF NOT EXISTS buses (
    id SERIAL PRIMARY KEY,
    number VARCHAR NOT NULL UNIQUE,
    route_id INTEGER REFERENCES routes(id),
    capacity INTEGER NOT NULL,
    current_location JSONB,
    is_active BOOLEAN DEFAULT true
);

-- Horários de ônibus
CREATE TABLE IF NOT EXISTS schedules (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER NOT NULL REFERENCES buses(id),
    route_id INTEGER NOT NULL REFERENCES routes(id),
    departure_time VARCHAR NOT NULL,
    arrival_time VARCHAR NOT NULL,
    days_of_week VARCHAR NOT NULL,
    assigned_driver_id INTEGER REFERENCES drivers(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    is_active BOOLEAN DEFAULT true
);

-- ============================================================
-- TABELAS DE RESERVAS E VIAGENS
-- ============================================================

-- Reservas de viagens
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    schedule_id INTEGER NOT NULL REFERENCES schedules(id),
    booking_date TIMESTAMP NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'confirmed',
    qr_code VARCHAR UNIQUE,
    qr_code_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Reservas de assentos de ônibus
CREATE TABLE IF NOT EXISTS bus_reservations (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    bus_id INTEGER NOT NULL REFERENCES buses(id),
    schedule_id INTEGER REFERENCES schedules(id),
    reservation_date TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR NOT NULL DEFAULT 'active',
    seat_number INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABELAS DE CARPOOL (CARONAS)
-- ============================================================

-- Caronas oferecidas
CREATE TABLE IF NOT EXISTS rides (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL REFERENCES students(id),
    from_location VARCHAR NOT NULL,
    to_location VARCHAR NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    available_seats INTEGER NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0,
    description TEXT,
    status VARCHAR NOT NULL DEFAULT 'available',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Solicitações de carona
CREATE TABLE IF NOT EXISTS ride_requests (
    id SERIAL PRIMARY KEY,
    ride_id INTEGER NOT NULL REFERENCES rides(id),
    passenger_id INTEGER NOT NULL REFERENCES students(id),
    status VARCHAR NOT NULL DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABELAS DE EVENTOS
-- ============================================================

-- Eventos universitários com transporte
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    event_time VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    event_image_url VARCHAR,
    pickup_points TEXT,
    transport_price_one_way DECIMAL(10, 2) NOT NULL,
    transport_price_round_trip DECIMAL(10, 2) NOT NULL,
    transport_price_return DECIMAL(10, 2) NOT NULL,
    total_seats INTEGER NOT NULL,
    available_seats INTEGER NOT NULL,
    bank_details TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by VARCHAR REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Reservas de transporte para eventos
CREATE TABLE IF NOT EXISTS event_bookings (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id),
    student_id INTEGER NOT NULL REFERENCES students(id),
    trip_type VARCHAR NOT NULL,
    student_address TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR NOT NULL DEFAULT 'pending',
    qr_code VARCHAR UNIQUE,
    qr_code_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Comprovativos de pagamento
CREATE TABLE IF NOT EXISTS payment_proofs (
    id SERIAL PRIMARY KEY,
    event_booking_id INTEGER NOT NULL REFERENCES event_bookings(id),
    proof_image_url VARCHAR NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW(),
    approval_status VARCHAR NOT NULL DEFAULT 'pending',
    approved_by VARCHAR REFERENCES users(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT
);

-- ============================================================
-- DADOS INICIAIS
-- ============================================================

-- Inserir universidades padrão
INSERT INTO universities (name, code, address) VALUES
    ('Universidade Agostinho Neto', 'UAN', 'Luanda, Angola'),
    ('Universidade Católica de Angola', 'UCAN', 'Luanda, Angola'),
    ('Universidade Metodista de Angola', 'UMA', 'Luanda, Angola')
ON CONFLICT (code) DO NOTHING;

-- Inserir planos de assinatura padrão
INSERT INTO subscription_plans (name, duration, price, features, is_active) VALUES
    ('Semanal', 'weekly', 2500.00, '["10 viagens por semana", "Desconto de 15%", "Reserva prioritária"]', true),
    ('Mensal', 'monthly', 8000.00, '["Viagens ilimitadas", "Desconto de 25%", "Reserva prioritária", "Suporte premium"]', true),
    ('Mensal Plus', 'monthly', 12000.00, '["Viagens ilimitadas", "Desconto de 30%", "Reserva VIP", "Suporte 24/7", "Wi-Fi grátis"]', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- FIM DO SCHEMA
-- ============================================================
