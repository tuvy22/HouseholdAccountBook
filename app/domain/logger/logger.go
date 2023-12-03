package logger

import (
	"runtime"

	"github.com/sirupsen/logrus"
)

type Logger interface {
	Info(msg string)
	Warn(msg string)
	Error(err error)
	ErrorMsg(msg string)
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

func (l *logrusLoggerImpl) Info(msg string) {
	l.Logger.Info(msg)
}

func (l *logrusLoggerImpl) Warn(msg string) {
	l.Logger.Warn(msg)
}
func (l *logrusLoggerImpl) Error(err error) {
	l.error(err.Error())
}
func (l *logrusLoggerImpl) ErrorMsg(msg string) {
	l.error(msg)
}

func (l *logrusLoggerImpl) error(msg string) {
	l.Logger.WithFields(logrus.Fields{
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
