const functions = [
  `DROP FUNCTION IF EXISTS controversy;
     CREATE FUNCTION controversy(ups INTEGER, downs INTEGER) RETURNS double
          DETERMINISTIC
      BEGIN
        DECLARE score DOUBLE;
        DECLARE magnitude INTEGER;
        DECLARE balance DOUBLE;
        
        IF (downs <= 0 || ups <= 0) THEN
          SET score = 0;
        ELSE
          SET magnitude = ups + downs;
        SET balance = IF((ups > downs), (downs / ups), (ups / downs));
          SET score = POW(magnitude, balance);
        END IF;
  
        RETURN (score);
  END;`,
  `DROP FUNCTION IF EXISTS hot;
   CREATE FUNCTION hot(ups INTEGER, downs INTEGER, dat DATE) RETURNS double
    DETERMINISTIC
    BEGIN
        DECLARE s INTEGER;
        DECLARE ord DOUBLE;
        DECLARE normalizedSeconds INTEGER;
        
        SET s = ups - downs;
        SET ord = LOG10(GREATEST(ABS(s), 1));
        SET normalizedSeconds = UNIX_TIMESTAMP(dat) - 1134028003; /* unixInitailTimestamp */
        RETURN (SIGN(s) * ord + normalizedSeconds / 45000); /*  decaySeconds: 12.5 h = 45000 s*/
    END;`,
  `DROP FUNCTION IF EXISTS top;
   CREATE FUNCTION top(ups INTEGER, downs INTEGER) RETURNS double
    DETERMINISTIC
    BEGIN
      DECLARE z DOUBLE DEFAULT 1.96;
      DECLARE score DOUBLE;
      DECLARE magnitude INTEGER;
      DECLARE p DOUBLE;
      DECLARE sqrtexpr DOUBLE;
      
      SET magnitude = ups + downs;
      IF (magnitude = 0) THEN
        SET score = 0;
      ELSE
        SET p = ups / magnitude;
        SET sqrtexpr = (p * (1 - p) + z * z / (4 * magnitude)) / magnitude;
      SET score = (p + z * z / (2 * magnitude) - z * SQRT(sqrtexpr)) / (1 + z * z / magnitude);
      END IF;
      RETURN (score);
    END;`,
];

const all = functions.join('  ');

module.exports = all;
