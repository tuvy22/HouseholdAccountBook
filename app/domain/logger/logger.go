package logger

import (
	"runtime"

	"github.com/sirupsen/logrus"
)

type Logger interface {
	Info(userId string, msg string)
	Warn(userId string, msg string)
	Error(userId string, err error)
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

func (l *logrusLoggerImpl) Info(userId string, msg string) {
	l.Logger.WithFields(logrus.Fields{
		"user_id": userId,
	}).Info(msg)
}

func (l *logrusLoggerImpl) Warn(userId string, msg string) {
	l.Logger.WithFields(logrus.Fields{
		"user_id": userId,
	}).Warn(msg)
}
func (l *logrusLoggerImpl) Error(userId string, err error) {
	l.error(userId, err.Error())
}
func (l *logrusLoggerImpl) ErrorMsg(userId string, msg string) {
	l.error(userId, msg)
}

func (l *logrusLoggerImpl) error(userId string, msg string) {
	l.Logger.WithFields(logrus.Fields{
		"user_id":     userId,
		"stack_trace": getStackTrace(),
	}).Error(msg)
}

func getStackTrace() string {
	buf := make([]byte, 1024)
	for {
		n := runtime.Stack(buf, false)
		if n < len(buf) {
			return string(buf[:n])
		}
		buf = make([]byte, len(buf)*2)
	}
}
