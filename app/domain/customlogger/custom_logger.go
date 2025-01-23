package customlogger

import (
	"github.com/sirupsen/logrus"
)

type Logger interface {
	Info(userId string, msg string)
	Warn(userId string, msg string)
	ErrorStack(userId string, stack string)
	Error(userId string, err error, stack string)
	ErrorMsg(userId string, msg string)
}

type logrusLoggerImpl struct {
	*logrus.Logger
}

func NewLogrusLogger() Logger {
	logger := logrus.New()
	formatter := &logrus.TextFormatter{
		DisableQuote: true,
	}
	logger.SetFormatter(formatter)
	return &logrusLoggerImpl{logger}
}

func (l *logrusLoggerImpl) Info(userId string, code string) {
	l.Logger.WithFields(logrus.Fields{
		"login_id": userId,
	}).Info(code)
}

func (l *logrusLoggerImpl) Warn(userId string, code string) {
	l.Logger.WithFields(logrus.Fields{
		"login_id": userId,
	}).Warn(code)
}
func (l *logrusLoggerImpl) ErrorStack(userId string, stack string) {
	l.error(userId, "", stack)
}
func (l *logrusLoggerImpl) Error(userId string, err error, stack string) {
	l.error(userId, err.Error(), stack)
}
func (l *logrusLoggerImpl) ErrorMsg(userId string, msg string) {
	l.error(userId, msg, "")
}

func (l *logrusLoggerImpl) error(userId string, msg string, stack string) {
	l.Logger.WithFields(logrus.Fields{
		"login_id":    userId,
		"error_msg":   msg,
		"stack_trace": stack,
	}).Error()
}

// func getStackTrace() string {
// 	buf := make([]byte, 1024)
// 	for {
// 		n := runtime.Stack(buf, false)
// 		if n < len(buf) {
// 			return string(buf[:n])
// 		}
// 		buf = make([]byte, len(buf)*2)
// 	}
// }
