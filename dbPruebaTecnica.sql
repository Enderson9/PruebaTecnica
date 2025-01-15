-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dbpruebatecnica
-- ------------------------------------------------------
-- Server version	9.1.0
CREATE DATABASE dbpruebatecnica;
USE dbpruebatecnica;

-- Table structure for table `tbtarjetas`
--

DROP TABLE IF EXISTS `tbTarjetas`;

CREATE TABLE `tbTarjetas` (
  `tarj_Id` int NOT NULL AUTO_INCREMENT,
  `tarj_Titulo` varchar(255) NOT NULL,
  `tarj_Descripciones` json NOT NULL,
  `tarj_FechaCreacion` datetime NOT NULL,
  PRIMARY KEY (`tarj_Id`),
  UNIQUE KEY `tarj_Titulo` (`tarj_Titulo`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbtarjetas`
--

LOCK TABLES `tbTarjetas` WRITE;

INSERT INTO `tbTarjetas` VALUES (74,'Tarjeta 1','[\"Descripcion 1\", \"Descripcion 2\"]','2025-01-15 07:01:06');

UNLOCK TABLES;

--
-- Dumping routines for database 'dbpruebatecnica'
--
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_Tarjetas_Listar`(
)
BEGIN
	SELECT	tarj_Id,
			tarj_Titulo,
            tarj_Descripciones,
            tarj_FechaCreacion
    FROM tbTarjetas;
END ;;
DELIMITER ;

DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_Tarjeta_Actualizar`(
		IN p_tarj_Id INT,
        IN p_tarj_Titulo VARCHAR (255),
        IN p_tarj_Descripciones JSON
    )
BEGIN
		DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
			ROLLBACK;
            SELECT 'Error' AS Message;
        END;
        
        START TRANSACTION;
	
        UPDATE tbTarjetas
        SET tarj_Titulo = p_tarj_Titulo,
			tarj_Descripciones = p_tarj_Descripciones
		WHERE tarj_Id = p_tarj_Id;
        
        COMMIT;
        SELECT 'Exito' AS Message;
    END ;;
DELIMITER ;

DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_Tarjeta_Eliminar`(
    IN p_tarj_Id INT
    )
BEGIN
		DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
			ROLLBACK;
            SELECT 'Error' AS Message;
        END;
        
        START TRANSACTION;
        
        DELETE FROM tbTarjetas
        WHERE tarj_Id = p_tarj_Id;
        
        COMMIT;
        SELECT 'Exito' AS Message;
	END ;;
DELIMITER ;

DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_Tarjeta_Insertar`(
	IN p_tarj_Titulo VARCHAR (255),
    IN p_tarj_Descripciones JSON,
    IN p_tarj_FechaCreacion DATETIME
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		ROLLBACK;
        SELECT 'Error' AS Message;
    END;
    
    START TRANSACTION;
    
	INSERT INTO tbTarjetas (tarj_Titulo, tarj_Descripciones, tarj_FechaCreacion)
    VALUES (p_tarj_Titulo, p_tarj_Descripciones, p_tarj_FechaCreacion);
    
    COMMIT;
    
    SELECT 'Exito' AS Message;
END ;;
DELIMITER ;

-- Dump completed on 2025-01-15 11:31:35
