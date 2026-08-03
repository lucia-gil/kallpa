-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`user` ;

CREATE TABLE IF NOT EXISTS `mydb`.`user` (
  `iduser` INT NOT NULL,
  `carrera` VARCHAR(64) NOT NULL,
  `ciclo` VARCHAR(2) NOT NULL,
  `name` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`iduser`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`mensaje`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`mensaje` ;

CREATE TABLE IF NOT EXISTS `mydb`.`mensaje` (
  `idmensaje` INT NOT NULL,
  `user` INT NOT NULL,
  `mensaje` VARCHAR(254) NULL,
  `fecha` VARCHAR(45) NULL,
  `estado` VARCHAR(2) NULL,
  PRIMARY KEY (`idmensaje`),
  INDEX `fk_mensaje_user_idx` (`user` ASC) VISIBLE,
  CONSTRAINT `fk_mensaje_user`
    FOREIGN KEY (`user`)
    REFERENCES `mydb`.`user` (`iduser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


INSERT INTO `mydb`.`user` (`iduser`, `carrera`, `ciclo`, `name`) VALUES
  (1, 'Ingeniería', '7', 'Lucía'),
  (2, 'Ingeniería', '1', 'María'),
  (3, 'Ingeniería', '2', 'Luis'),
  (4, 'Ingeniería', '3', 'Andrea');

-- -----------------------------------------------------
-- estado: 1 = 😔  |  2 = 😐  |  3 = 🙂
-- -----------------------------------------------------
INSERT INTO `mydb`.`mensaje` (`idmensaje`, `user`, `mensaje`, `fecha`, `estado`) VALUES
  (1, 2, 'Semana pesada, parciales',   '2026-08-01', '1'),
  (2, 3, 'Igual, ánimo equipo',        '2026-08-01', '2'),
  (3, 4, 'Mejor que la semana pasada', '2026-08-02', '3');

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;